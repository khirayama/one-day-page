import * as React from 'react';

import { IngredientInfo } from '../services';

export function Ingredients(props: {
  seasonalVegetables: IngredientInfo[];
  seasonalFruits: IngredientInfo[];
  seasonalFishes: IngredientInfo[];
  seasonalSeafoods: IngredientInfo[];
  seasonalOthers: IngredientInfo[];
}) {
  return (
    <>
      <h2>旬の食べ物</h2>
      <div>
        {[
          props.seasonalVegetables,
          props.seasonalFruits,
          props.seasonalFishes,
          props.seasonalSeafoods,
          props.seasonalOthers,
        ].map((ingredients: IngredientInfo[], i) => {
          return (
            <div key={`ingredient-${i}`} className="p-4">
              <ul>
                {ingredients.map((ingredient: IngredientInfo) => {
                  return (
                    <li key={ingredient.name}>
                      [{ingredient.labelJa}] {ingredient.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
