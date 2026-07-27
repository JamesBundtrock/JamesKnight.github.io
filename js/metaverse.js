function getHypercubeGeneration() {
    if (gameData.rebirthFiveCount == 0) return 0   

    let tesseractEffect = gameData.itemData["Tesseract"].getEffect()
    let hypersphereEffect = gameData.itemData["Hypersphere"].getEffect()

    return 0.03 * hypersphereEffect * tesseractEffect * gameData.metaverse.hypercube_gain_modifier * getSingularityEffect() * (gameData.perks.hypercube_boost == 1 ? 10 : 1)
        * (gameData.perks.hyper_speed == 1 ? 1000 : 1)
}

function getSingularityGain() {
    return gameData.essence >= 1e300 ? Math.floor(Math.log10(gameData.essence)) - 288 : 0
}

function getSingularityEffect() {
    return gameData.singularities * 10 + 1
}

function getSingularityHappinessEffect() {
    return Math.pow(2, gameData.singularities)
}

function getNextPowerOfNumber(number, add_power = 0) {
    return Math.pow(10, add_power + Math.ceil(Math.log10(number)))
}

function getTimeTillNextHypercubePower(add_power = 0) {
    return (getNextPowerOfNumber(gameData.hypercubes, add_power) - gameData.hypercubes) / (applyUnpausedSpeed(getHypercubeGeneration()) * updateSpeed)
}

function getBoostTimeSeconds() {
    let defaultTime = 600.0 * gameData.metaverse.boost_timer_modifier * Math.max( (1+0.01*(gameData.rebirthThreeCount)),1 )

    return defaultTime
}

function getBoostCooldownSeconds() {
    let defaultTime = 6.0 * 10.0 / (gameData.metaverse.boost_cooldown_modifier* Math.max( (1+0.01*(gameData.rebirthTwoCount)),1 ))

    return defaultTime
}

function canApplyBoost() {
    return gameData.boost_cooldown <= 0 && !gameData.boost_active;
}

function applyBoost() {
    if (canApplyBoost()) {
        gameData.boost_timer = getBoostTimeSeconds();
        gameData.boost_active = true;
    }
}

// shop
function canAffordHypercubes(cost) {
    return gameData.hypercubes >= cost
}

function buyMetaverseUpgrade(cost, key, value = gameData.metaverse[key] + 1) {
    if (!canAffordHypercubes(cost)) return
    gameData.hypercubes -= cost
    gameData.metaverse[key] = value
}

function reduceBoostCooldownCost() {
    return 1000 * Math.pow(3, gameData.metaverse.boost_cooldown_modifier - 1)
}

function canBuyReduceBoostCooldown() {
    return canAffordHypercubes(reduceBoostCooldownCost())
}

function buyReduceBoostCooldown() {
    buyMetaverseUpgrade(reduceBoostCooldownCost(), "boost_cooldown_modifier")
}


function boostDurationCost() {
    return 5000 * Math.pow(5, gameData.metaverse.boost_timer_modifier - 1)
}

function canBuyBoostDuration() {
    return canAffordHypercubes(boostDurationCost())
}

function buyBoostDuration() {
    buyMetaverseUpgrade(boostDurationCost(), "boost_timer_modifier")
}


function hypercubeGainCost() {
    return 800 * Math.pow(1.5, gameData.metaverse.hypercube_gain_modifier - 1)
}

function canBuyHypercubeGain() {
    return canAffordHypercubes(hypercubeGainCost())
}

function buyHypercubeGain() {
    buyMetaverseUpgrade(hypercubeGainCost(), "hypercube_gain_modifier")
}

function evilTranGain() {
    return (gameData.metaverse.evil_tran_gain == 0) ? 0 : 250000 * Math.pow(10, gameData.metaverse.evil_tran_gain)
}

function evilTranCost() {
    return 100000000 * Math.pow(10, gameData.metaverse.evil_tran_gain)
}

function canBuyEvilTran() {
    return canAffordHypercubes(evilTranCost())
}

function buyEvilTran() {
    buyMetaverseUpgrade(evilTranCost(), "evil_tran_gain")
}

function essenceMultGain() {
    return (gameData.metaverse.essence_gain_modifier == 0) ? 1 : Math.pow(10, gameData.metaverse.essence_gain_modifier)
}

function essenceMultCost() {
    return 1e9 * Math.pow(10, gameData.metaverse.essence_gain_modifier)
}

function canBuyEssenceMult() {
    return canAffordHypercubes(essenceMultCost())
}

function buyEssenceMult() {
    buyMetaverseUpgrade(essenceMultCost(), "essence_gain_modifier")
}


function challengeAltarCost() {
    return 1e14
}

function canBuyChallengeAltar() {
    return gameData.metaverse.challenge_altar == 0 && canAffordHypercubes(challengeAltarCost())
}

function buyChallengeAltar() {
    if (canBuyChallengeAltar()) buyMetaverseUpgrade(challengeAltarCost(), "challenge_altar", 1)
}


function darkMatterMultGain() {
    return (gameData.metaverse.dark_mater_gain_modifer == 0) ? 1 : Math.pow(10, gameData.metaverse.dark_mater_gain_modifer)
}

function darkMatterMultCost() {
    return 1e19 * Math.pow(10, gameData.metaverse.dark_mater_gain_modifer)
}

function canBuyDarkMatterMult() {
    return canAffordHypercubes(darkMatterMultCost())
}

function buyDarkMaterMult() {
    buyMetaverseUpgrade(darkMatterMultCost(), "dark_mater_gain_modifer")
}

// perks

function getMetaversePerkPointsGain() {
    if (gameData.essence >= 1e90)
        return (gameData.perks.more_perk_points == 1 ? 10 : 1)
            * (gameData.perks.double_perk_points_gain == 1 ? 2 : 1)
            * getMetaversePerkPointResetBonus()
            * (Math.floor(Math.log10(gameData.essence)) - 89)

    return 0
}

function getMetaversePerkPointResetBonus() {
    return Math.pow(1.1, gameData.infiniteHypercubeCapResets || 0)
}

const perks_cost = {
    auto_dark_orb: 1,
    auto_dark_shop: 1,
    auto_boost: 1,
    instant_evil: 2,
    hypercube_boost: 5,
    instant_essence: 10,
    save_challenges: 15,
    instant_dark_matter: 25,
    auto_sacrifice: 40,
    double_perk_points_gain: 50,
    positive_dark_mater_skills: 100,
    hyper_speed: 200,
    both_dark_mater_skills: 300,
    keep_dark_mater_skills: 500,
    evil_booster: 2500,
    more_perk_points: 5000,
}

const perk_names = {
    auto_dark_orb: "Auto buy dark orb generators",
    auto_dark_shop: "Auto buy dark shop items",
    auto_boost: "Auto boost",
    instant_evil: "Instant evil",
    hypercube_boost: "Hypercube boost",
    instant_essence: "Instant essence",
    save_challenges: "Save challenges",
    instant_dark_matter: "Instant dark matter",
    auto_sacrifice: "Auto sacrifice",
    double_perk_points_gain: "2x perk points gain",
    positive_dark_mater_skills: "Only positive dark matter abilities",
    hyper_speed: "Hyper speed",
    both_dark_mater_skills: "Pick both dark matter abilities",
    keep_dark_mater_skills: "keep dark matter abilities",
    evil_booster: "Evil booster",
    more_perk_points: "10x perk points gain",
}

function getMetaversePerkName(perkName) {    
    return perk_names[perkName]
}

function getPerkCost(perkName) {
    return perks_cost[perkName]
}

function canBuyPerk(perkName) {
    return gameData.perks_points >= getPerkCost(perkName)
}

function buyPerk(perkName) {
    if (gameData.perks[perkName] == 0) {
        if (canBuyPerk(perkName)) {
            gameData.perks_points -= getPerkCost(perkName)
            gameData.perks[perkName] = 1

            if (perkName == "both_dark_mater_skills") {
                buySpeedOfLife(3)
                buyYourGreatestDebt(3)
                buyEssenceCollector(3)
                buyExplosionOfTheUniverse(3)
                buyMultiverseExplorer(3)
            }
        }
    }
    else {
        gameData.perks[perkName] = 0
        gameData.perks_points += getPerkCost(perkName)

        if (perkName == "both_dark_mater_skills") {
            if (gameData.dark_matter_shop.speed_is_life == 3)
                gameData.dark_matter_shop.speed_is_life = 2
            if (gameData.dark_matter_shop.your_greatest_debt == 3)
                gameData.dark_matter_shop.your_greatest_debt = 1    
            if (gameData.dark_matter_shop.essence_collector == 3)
                gameData.dark_matter_shop.essence_collector = 2
            if (gameData.dark_matter_shop.explosion_of_the_universe == 3)
                gameData.dark_matter_shop.explosion_of_the_universe = 2
            if (gameData.dark_matter_shop.multiverse_explorer == 3)
                gameData.dark_matter_shop.multiverse_explorer = 2    
        }
    }
}

function getTotalPerkPoints() {
    let total = gameData.perks_points
    for (const key of Object.keys(gameData.perks)) {
        if (gameData.perks[key] == 1)
            total += getPerkCost(key)
    }
    return total
}

function collectPerkPoints(value) {
    for (const key of Object.keys(gameData.perks)) {
        if (gameData.perks[key] == value) {
            buyPerk(key)
        }        
    }
}

function getBoostCooldownString() {
    return gameData.boost_active
        ? "Active: " + formatTime(gameData.boost_timer)
        : (gameData.boost_cooldown <= 0 ? "Ready!" : "Cooldown: " + formatTime(gameData.boost_cooldown))
}

function getTimeIsAFlatCircleXP() {
    if (gameData.active_challenge == "the_darkest_time")
        return 1

    return gameData.requirements["Time is a flat circle"].isCompleted() ? 1e50 : 1
}

function getUnspentPerksDarkmatterGainBuff() {
    const effect = softcap(gameData.perks_points * 0.0027 + 2, 75, 0.01)

    return gameData.requirements["The End is near"].isCompleted() ? Math.pow(10, effect): 1
}

function getHypercubeCap(next = 0) {
    if (getTotalPerkPoints() >= 1 || (next > 0 && getMetaversePerkPointsGain() > 0))
        return Infinity

    return 1e7 * Math.pow(10, (gameData.rebirthFiveCount + next) * 3)
}
