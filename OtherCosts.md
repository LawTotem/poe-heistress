# Costs

There are two major costs to running Heist content other than the reveal cost of blueprints.
The cost of running contracts and the cost of running blueprints, both of which are covered here.

# Costs of Contracts

All the data collected for this test was based on high level characters.
It is possible that low level characters see different numbers.

***Bottom Line*** Area level 83 Priceless is great but Precious with 5 required job level could be worth quite a bit. The absolute best would be a job level 5 priceless contract, which would have a target worth about 5473 markers. For these contracts you can expect to spend about 400 markers in fees, assuming you don't have gear to reduce costs, split between ring cut, transport, and rogue hire fee, of which the transport is the cheapest.

***Note*** The equations used here are all just based on simple fits and probably look more accurate than they probably are.
All, except the rogue hire cost, are deterministic, so you should be able to check with very few contracts.

## Ring Cut
The ring cut is deterministic based on the Area Level of the contract.
It ranges from 105 to 193 Rogue Markers for area levels from 46 to 83, with the following equation a pretty good approximation.
$$ 193 - 2.385 \left(83 - \ell\right) $$

## Transport Cost
The transport cost, like the ring cut, only depends on the Area Level of the contract.
It varies from 51 to 94 Rogue Markers for area levels from 46 to 83, with the following equation as a pretty good approximation.
$$ 1.17 \left(\ell - 46\right) + 51 $$

## Rogue Hire Cost

The cost of hiring a rogue is based on their level in the contract's job ***without*** skiller tools.
There is a visual bug which makes it so that when you are selecting the rogue the cost *appears* to be based on their level with the skiller gear but after selection the cost adjusts to the correct mark.

$$62 + 18 j + \mathcal{U}\left(-20,20\right) + \mathcal{U}{\left(-10,10\right)}$$

## Target/Reward
The target/reward of a contract is a *negative* cost
The value of the reward offered at the end of the contract only depends on the *target rating* (Priceless, Precious, High, Moderate), area level, and **job level**.

### Job Level
The easiest is the job level increases the value of the target by 10% per job level, So a job level 1 in an area level 83 zone with priceless target would normally reward 3909 Rogue Markers but the same contract with job level 4, 30% increase, would give a target worth 5091 Rogue Markers. 

### Target Rating
I was hoping to find a really simple metric for these, but I couldn't find one.
The best I could find is to base everything off the value of the *Precious* value.
Based on this, the scale factors are as follows.

| Value | Factor |
| --- | --- |
| Priceless | 2.0 |
| Precious | 1.0 |
| High | 0.80 |
| Moderate | 0.5666 |

### Area Level
Area Level's impact on the price of things is a bit more complicated.
It appears to break into two distinct regions.


$$ \text{Precious} = \left\lbrace \begin{aligned} 643 + 14.85 \left(\ell - 45\right) &\quad \text{if } \ell < 68\\ 987 + 55 \left(\ell - 68\right) + 0.638 \left(\ell - 68\right)^2 & \quad \text{otherwise} \end{aligned} \right. $$

For a rough idea at area level 45 I think a precious reward would be about 643 Rogue markers, by 68 this would have increased to 985 at about 15 rogue markers per level.
After level 68 the rogue markers per level becomes 55 and ramps up to 75 at area level 83, where a precious reward would be worth 1954 Markers.

# Blueprint Costs

Based on a small analysis, it appears that the blueprint costs are the same as the contract costs with the following notes.

**Bottom Line** Rogue hire cost reduction is probably the best way to save markers.

## Ring Cut
The rings cut is the same as for a single contract - it does not appear to be impacted by the number of wings, revealed or not.

## Transport Cost
The transport cost is *per rogue* not per job, so re-using rogues does not increase travel cost.
Gear that reduces travel cost applies only to the rogue wearing it.

## Rogue Hire Cost
All the same jank as the contract cost.
Gear that reduces hire cost only applies to the rogue wearing it.