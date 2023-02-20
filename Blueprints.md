# Blueprint Reveal Strategy

I'm going to go over some of the subtleties of blueprint revealing. This is not a complete guide to blueprint revealing, not really my thing - simply information you can use to make better decisions.

# Blueprint Reveal Costs

As you reveal *things* in blueprints, the cost of revealing other things increases. It turns out that this is reasonably predictable.

- Each *revealed* reward room increases the cost of revealing things by 5%
- Each *revealed* wing **beyond** the first increases the cost of revealing things by 20%
- Each *revealed* escape route increases the cost of revealing things by 2%

***Note***: Blueprints *normally* come with 3 rooms revealed in the first room so a baseline 15% increase and when you reveal a wing you get 3 free room reveals with it for a total increase of 35% increase (20% for the wing, 15% for three rooms).

If you want to verify this you can note the cost of reveals and track how the change as you reveal things. The easiest way to see these effects is on a split (via fractured fossil or split beast) blueprint where there are no *free* reveals. The split blueprints can also be used to verify that the rooms that are revealed on normal blueprints as part of a wing reveal are free, as the split one will have the same base cost for a room. For example, here is a blueprint reveal with costs noted as I went with the estimated original cost based on the accumulated cost factor given in parenthesis.

| Room/Title    | Reveal 1    | Reveal 2    | Reveal 3    | Reveal 4    | Reveal 5    | Reveal 6    |
| ---           | ---         | ---         | ---         | ---         | ---         | ---         |
| Cost Increase | -           | 35%         | 5%          | 5%          | 35%         |  35%        |
| Cost Factor   | 15%         | 50%         | 55%         | 55%         | 60%         | 130%        |
| `Wing 1`      | -           | -           | -           | -           | -           | -           |
| Harb          | -           | -           | -           | -           | -           | -           |
| Currency      | -           | -           | -           | -           | -           | -           |
| Blight        | 912 (793)   | 1189 (793)  | 1129 (793)  | 1268 (793)  | 1546 (793)  | 1823 (793)  |
| Currency      | -           | -           | -           | -           | -           | -           |
| Metamorph     | 799 (695)   | 1042 (695)  | 1077 (695)  | 1111 (694)  | 1355 (695)  | 1598 (695)  |
| Metamorph     | 920 (800)   | 1200 (800)  | 1241 (801)  | 1281 (801)  | 1561 (801)  | 1841 (800)  |
| Div Cards     | 781 (679)   | 1019 (679)  | **X**       | -           | -           | -           |
| Escape        | 321 (279)   | 419 (279)   | 433 (279)   | 447 (279)   | 544 (279)   | 642 (279)   |
| `Wing 2`      | 3657 (3180) | **X**       | -           | -           | -           | -           |
| Accessories   | N/A         | -           | -           | -           | -           | -           |
| Frags         | N/A         | 1200 (800)  | 1241 (801)  | 1281 (800)  | 1561 (801)  | 1841 (800)  |
| Deli          | N/A         | 1065 (710)  | 1100 (710)  | 1136 (710)  | 1384 (709)  | 1632 (710)  |
| Currency      | N/A         | 1234 (823)  | 1276 (823)  | 1317 (823)  | 1605 (823)  | 1893 (823)  |
| Escape        | N/A         | 476 (317)   | 492 (317)   | 508 (318)   | 619 (317)   | 730 (317)   |
| Accessories   | N/A         | -           | -           | -           | -           | -           |
| Div Cards     | N/A         | 1121 (747)  | 1159 (748)  | **X**       | -           | -           |
| Div Cards     | N/A         | -           | -           | -           | -           | -           |
| `Wing 3`      | 3403 (2959) | 4439 (2959) | 4587 (2959) | 4735 (2959) | **X**       | -           |
| Escape        | N/A         | N/A         | N/A         | N/A         | 567 (291)   | 669 (291)   |
| Harb          | N/A         | N/A         | N/A         | N/A         | 1428 (732)  | 1684 (732)  |
| Deli          | N/A         | N/A         | N/A         | N/A         | 1605 (823)  | 1893 (823)  |
| Currency      | N/A         | N/A         | N/A         | N/A         | -           | -           |
| Breach        | N/A         | N/A         | N/A         | N/A         | 1443 (740)  | 1702 (740)  |
| Metamorph     | N/A         | N/A         | N/A         | N/A         | -           | -           |
| Currency      | N/A         | N/A         | N/A         | N/A         | 1590 (815)  | 1875 (815)  |
| Weapons       | N/A         | N/A         | N/A         | N/A         | -           | -           |
| `Wing 4`      | 3765 (3274) | 4911 (3274) | 5075 (3274) | 5239 (3274) | 6385 (3274) | **X**       |
| Metamorph     | N/A         | N/A         | N/A         | N/A         | N/A         | -           |
| Talisman      | N/A         | N/A         | N/A         | N/A         | N/A         | -           |
| Escape        | N/A         | N/A         | N/A         | N/A         | N/A         | 615 (267)   |
| Frags         | N/A         | N/A         | N/A         | N/A         | N/A         | 1841 (800)  |
| Metamorph     | N/A         | N/A         | N/A         | N/A         | N/A         | 1632 (710)  |
| Accessories   | N/A         | N/A         | N/A         | N/A         | N/A         | -           |
| Deli          | N/A         | N/A         | N/A         | N/A         | N/A         | 1667 (725)  |
| Frags         | N/A         | N/A         | N/A         | N/A         | N/A         | 1823 (793)  |

# Basic Reveal Order/Discount Strategy Discussion

Every blueprint is different and depending on how many rooms you end up revealing things may be slightly different, but I'll do a quick analysis on the blueprint I already tracked.

## Discount Strategy Comparison

We can think about the cost in markers revealing the same rooms with different discount strategies. Example discount strategies:
 - **All Whakano**, The most expensive but doesn't require any Gianna reveals
 - **All Gianna**, The cheapest strategy but requires the most Gianna reveals (45% discount 55% Whakano cost.)
 - **Gianna Wings, Whakano Rooms**, Tries to get most of the benefit of Gianna reveals
 - **Whakano First Wing, Gianna Wings, Whakano Rooms**, Attempts to stretch Gianna reveals a bit farther.

Original Order, `Wing 2` - Div - Div - `Wing 3` - `Wing 4`.
 - All Whakano $3657+1019+1159+4734+6385 = 16954$ Rogue Markers, 0 Gianna
 - All Gianna $0.55 * \left(3657+1019+1159+4734+6385\right) = 9325$ Rogue Markers, 5 Gianna
 - Gianna Wings, Whakano Rooms $0.55 * 3657+1019+1159+0.55 * \left(4734+6385\right) = 10305$ Rogue Markers, 3 Gianna
 - Whakano 1st wing, Gianna Wings, Whakano Rooms $3657+1019+1159+0.55 * \left(4734+6385\right) = 11951$, 2 Gianna

Because we ultimately end up revealing the same rooms, the only thing that changes between the discount strategies is the value of Gianna reveals vs. rogue markers. So, comparing the first and second strategy we save 7629 rogue markers at the cost of 5 Gianna reveals, so if a Gianna reveal is worth less than 1525.8 rogue markers you would pick the second strategy. We can compare all strategies against each other in this way to find at what *value* of Gianna reveals you would prefer one over the other.
 *Considering only this reveal order*
 - All Gianna is best when Gianna reveals are worth less than 490 markers
 - Gianna Wings, Whakano Rooms - Gianna reveals between (490, 1646)
 - Whakano 1st wing, Gianna Wings, Whakano Rooms - Gianna reveals between (1646, 2501)

***Note***: What is a Gianna reveal worth to you - consider the value of Gianna contracts, the opportunity cost of running the contracts (time to run * value of time - value of contract loot), trading time to acquire the contracts.

## Reveal Order Comparison

Depending on reveal order we can modify the base costs of the rooms using the cost increases previously discussed. I've tried to include some simple strategies and include how much they cost. 
 - Div 1 - 679 base cost
 - Wing 2 - 3180 base cost
 - Div 2 - 748 base cost
 - Wing 3 - 2959 base cost
 - Wing 4 - 3274 base cost

Wings First, `Wing 4` - `Wing 2` - `Wing 3` - Div - Div
| Row Title     | Reveal 1 | Reveal 2 | Reveal 3 | Reveal 4 | Reveal 5 |
| ---           | ---      | ---      | ---      | ---      | ---      |
| Cost Increase | 0%       | 35%      | 35%      | 35%      | 5%       |
| Cost Factor   | 15%      | 50%      | 85%      | 120%     | 125%     |
| Reveal Room   | `Wing 4` | `Wing 2` | `Wing 3` | Div 2    | Div 1    |
| Base Cost     | 3274     | 3180     | 2959     | 748      | 679      |
| Full Cost     | 3765     | 4770     | 5474     | 1646     | 1528     |
| Gianna Cost   | 2071     | 2624     | 3011     | 905      | 840      |
 - All Whakano 17183,
 - All Gianna 9451
 - Gianna Wings, Whakano Rooms 10880
 - Whakano 1st wing, Gianna Wings, Whakano Rooms 12574

Rooms First, Div 1 - `Wing 2` - Div 2 - `Wing 4` - `Wing 3`.
| Row Title     | Reveal 1 | Reveal 2 | Reveal 3 | Reveal 4 | Reveal 5 |
| ---           | ---      | ---      | ---      | ---      | ---      |
| Cost Increase | 0%       | 5%       | 35%      | 5%       | 35%      |
| Cost Factor   | 15%      | 20%      | 55%      | 60%      | 125%     |
| Reveal Room   | Div 1    | `Wing 2` | Div 2    | `Wing 4` | `Wing 3` |
| Base Cost     | 679      | 3180     | 748      | 3765     | 2959     |
| Full Cost     | 781      | 3816     | 1159     | 5238     | 5770     |
| Gianna Cost   | 430      | 2099     | 637      | 2881     | 3714     |
 - All Whakano 16764
 - All Gianna 9221
 - Gianna Wings, Whakano Rooms 10094
 - Whakano 1st Wing, Gianna Wings, Whakano Rooms 11811

We can look at each discount strategy and find the cheapest reveal order and then compare the number of Gianna reveals in that strategy to find the Gianna *value* tipping points.
- All Whakano - Rooms First - 16764
- All Gianna - Rooms First - 9221 - Gianna is worth less than 437 
- Giann Wings, Whakano Rooms - Rooms First - 10094 - Gianna between (437, 1717)
- Whakano 1st Wing, Gianna Wings - Rooms First - 11811 - Gianna between (1717, 2476)

***Note***: When using rooms first you may want to consider revealing wings which are most likely to have rooms you want to reveal first.

## Split Blueprints

Because the duplicated blueprints, either from split beasts or fracture fossils, does not have base room reveals wing reveals are only their base 20%, which can result in cheaper reveal costs. For instance, if we only revealed wings in the previous blueprint.

| Room / Title  | Rev 1| Rev 2 | Rev 3 | Rev 4 | 
| ---           | ---  | ---   | ---   | ---   |
| Cost Increase | -    | 20%   | 20%   | 20%   |
| Cost Factor   | 0%   | 20%   | 40%   | 60%   |
| `Wing 1`      | -    | -     | -     | -     |
| `Wing 2`      | 3180 | 3816  | **X** | -     |
| `Wing 3`      | 2959 | 3551  | 4143  | **X** |
| `Wing 4`      | 3274 | **X** | -     | -     |

Depending on discount strategy 
 - All Whakano - 11233
 - All Gianna - 6179

The equivalent on the base contract would be 

| Room / Title  | Rev 1| Rev 2 | Rev 3 | Rev 4 | 
| ---           | ---  | ---   | ---   | ---   |
| Cost Increase | -    | 35%   | 35%   | 35%   |
| Cost Factor   | 15%  | 50%   | 85%   | 120%  |
| `Wing 1`      | -    | -     | -     | -     |
| `Wing 2`      | 3180 | 4770  | **X** | -     |
| `Wing 3`      | 2959 | 4439  | 5474  | **X** |
| `Wing 4`      | 3274 | **X** | -     | -     |

Depending on discount strategy
 - All Whakano - 14009
 - All Gianna - 7706

For this blueprint you would save 1527 markers by using the fractured blueprint. You will not have any revealed reward rooms in this scenario, but if the curio's are the only thing of value to you, this may be justified if the cost of a fractured fossil/resonator minus the marker savings is cheaper than buying another blueprint.
# Reward Room Strategies

To evaluate if a reward room is worth revealing you need to estimate how much the loot you're going to find is worth vs. how much it will cost. The cost of the rooms is the marker cost for their reveal, the marker cost increase for the rest of the rooms, and to some extent the value of time used to open the chests.
Consider the original, non duplicate blueprint. If use the Gianna wings, Whakano rooms strategy and only reveal wings, it costs us 7706 markers, if we reveal the first div card room but not the second, at reveal time the room costs 781 markers but the total cost of the blueprint reveal would increase to 8745 markers, for a delta of 1039 markers. The second divination reveal would have cost 1159 markers at reveal time, but total reveal cost would have increased to 9221 markers, a delta from one room cost of 1349 markers.
