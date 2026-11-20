-- match.lua: Atomic Multi-Slot Matchmaking Engine
-- KEYS[1] = 'waiting'
-- KEYS[2] = 'seen:' .. me
-- KEYS[3] = 'active:' .. me
-- KEYS[4] = 'blocked:' .. me
-- ARGV[1] = me (userId)
-- ARGV[2] = my_slot (1..3)
-- ARGV[3] = ttl (default 86400 = 24h)
-- ARGV[4] = random_ratio (uniform float in [0, 1) from Node Math.random)

local waiting_key = KEYS[1]
local seen_me_key = KEYS[2]
local active_me_key = KEYS[3]
local blocked_me_key = KEYS[4]

local me = ARGV[1]
local my_slot = ARGV[2]
local seen_ttl = tonumber(ARGV[3]) or 86400
local seed_val = tonumber(ARGV[4]) or 123456789
local active_ttl = 7200 -- 2 hours TTL for active sets

-- Seed math.random once (not per call) using persistent Redis key flag
local is_seeded = redis.call('EXISTS', 'lua:math_seeded')
if is_seeded == 0 then
    math.randomseed(seed_val)
    redis.call('SET', 'lua:math_seeded', '1')
end

-- Helper to parse "userId:slot"
local function parse_member(entry)
    local colon_idx = string.find(entry, ":")
    if not colon_idx then
        return nil, nil
    end
    local uid = string.sub(entry, 1, colon_idx - 1)
    local slot = string.sub(entry, colon_idx + 1)
    return uid, slot
end

local all_waiting = redis.call('SMEMBERS', waiting_key)

-- Helper to filter candidates
local function get_candidates(check_seen)
    local list = {}
    for _, entry in ipairs(all_waiting) do
        local uid, slot = parse_member(entry)
        if uid and uid ~= me then
            local is_seen = 0
            if check_seen then
                is_seen = redis.call('SISMEMBER', seen_me_key, uid)
            end

            local is_active = redis.call('SISMEMBER', active_me_key, uid)
            local is_blocked = redis.call('SISMEMBER', blocked_me_key, uid)
            local is_blocked_by_cand = redis.call('SISMEMBER', 'blocked:' .. uid, me)
            local is_cand_active_with_me = redis.call('SISMEMBER', 'active:' .. uid, me)

            if is_seen == 0 and is_active == 0 and is_blocked == 0 and is_blocked_by_cand == 0 and is_cand_active_with_me == 0 then
                table.insert(list, { entry = entry, uid = uid, slot = slot })
            end
        end
    end
    return list
end

-- Step a: Find candidates whose uid != me, not in seen:{me}, not in active:{me}, not in blocked:{me}
local candidates = get_candidates(true)

-- Step b: Reset seen:{me} ONLY IF waiting contains at least one candidate that is not self,
-- not blocked (both directions), and not active.
if #candidates == 0 then
    local unconstrained = get_candidates(false)
    if #unconstrained > 0 then
        redis.call('DEL', seen_me_key)
        candidates = unconstrained
    end
end

-- Step c: If still none: SADD me:slot to waiting, return nil
if #candidates == 0 then
    redis.call('SADD', waiting_key, me .. ':' .. my_slot)
    return nil
end

-- Step d: Pick one random candidate uniformly using math.random
local pick_idx = 1
if #candidates > 1 then
    pick_idx = math.random(1, #candidates)
end
local chosen = candidates[pick_idx]

-- Remove chosen candidate from waiting
redis.call('SREM', waiting_key, chosen.entry)

-- Remove me:my_slot from waiting if present
redis.call('SREM', waiting_key, me .. ':' .. my_slot)

-- Add each user to the other's seen set (with TTL 24h)
redis.call('SADD', seen_me_key, chosen.uid)
redis.call('EXPIRE', seen_me_key, seen_ttl)

local seen_cand_key = 'seen:' .. chosen.uid
redis.call('SADD', seen_cand_key, me)
redis.call('EXPIRE', seen_cand_key, seen_ttl)

-- Add each user to the other's active set with 2h TTL
redis.call('SADD', active_me_key, chosen.uid)
redis.call('EXPIRE', active_me_key, active_ttl)

local active_cand_key = 'active:' .. chosen.uid
redis.call('SADD', active_cand_key, me)
redis.call('EXPIRE', active_cand_key, active_ttl)

-- Return candidate's userId and slot
return { chosen.uid, chosen.slot }
