import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

interface IngredientSummary {
  name: string;
  quantity: number;
}

interface RecipeSummary {
  name: string;
  cookTime: number;
  ingredients: IngredientSummary[];
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = new Map<string, recipe | ingredient>();

// Task 1 helper (don't touch)
app.post("/parse", (req: Request, res: Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input);
  console.log(input);
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  }
  res.json({ msg: parsed_string });
  return;
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that
const parse_handwriting = (recipeName: string): string | null => {
  // Check if recipeName is null
  if (!recipeName) {
    return null;
  }
  //Replace hyphens and underscores with white space
  let parsed = recipeName.replace(/[-_]/g, " ");
  //Remove all but letters and spaces
  parsed = parsed.replace(/[^a-zA-Z\s]/g, "");
  //Trim then remove multiple spaces between letters
  parsed = parsed.trim().replace(/\s\s+/g, " ");

  // Format the sentence
  parsed = parsed
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return parsed;
};

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req: Request, res: Response) => {
  const entry = req.body;

  //Validate type of entry
  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    res.status(400).send();
    return;
  }
  //Check if cookbook already had this
  if (cookbook.has(entry.name)) {
    res.status(400).send();
    return;
  }
  //ingredient type
  if (entry.type === "ingredient") {
    // Validate cookTime for ingredients
    if (typeof entry.cookTime !== "number" || entry.cookTime < 0) {
      res.status(400).send();
      return;
    }
    cookbook.set(entry.name, entry as ingredient);
  
  //recipe type
  } else if (entry.type === "recipe") {
    const itemNames = new Set<string>();
    for (const item of entry.requiredItems) {
      if (itemNames.has(item.name)) {
        res.status(400).send();
        return;
      }
      itemNames.add(item.name);
    }

    cookbook.set(entry.name, entry as recipe);
  }
  console.log(cookbook);
  res.status(200).send();
});

//Task 3 helper
function getRecipeSummary(recipe: recipe): RecipeSummary {
  const cookTime = calculateCookTime(recipe);
  const ingredientMap = collectIngredients(recipe);

  // Format the response
  const ingredients: IngredientSummary[] = Array.from(
    ingredientMap.entries(),
    ([name, quantity]) => ({ name, quantity })
  );

  return { name: recipe.name, cookTime, ingredients };
}

function calculateCookTime(
  entry: recipe | ingredient,
  multiplier: number = 1
): number {
  if (entry.type === "ingredient") {
    return (entry as ingredient).cookTime * multiplier;
  } else {
    let total = 0;
    for (const { name, quantity } of (entry as recipe).requiredItems) {
      const item = cookbook.get(name);
      if (!item) throw new Error(`Item not found: ${name}`);
      total += calculateCookTime(item, multiplier * quantity);
    }
    return total;
  }
}

function collectIngredients(
  entry: recipe | ingredient,
  multiplier: number = 1
): Map<string, number> {
  const ingredients = new Map<string, number>();

  if (entry.type === "ingredient") {
    ingredients.set(entry.name, multiplier);
  } else {
    for (const { name, quantity } of (entry as recipe).requiredItems) {
      const item = cookbook.get(name);
      if (!item) throw new Error();

      const nextIngredients = collectIngredients(item, multiplier * quantity);
      for (const [name, qty] of nextIngredients.entries()) {
        let currentQuantity = ingredients.get(name);
        ingredients.set(name, currentQuantity + qty);
      }
    }
  }

  return ingredients;
}

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req: Request, res: Response) => {
  const recipeName = req.query.name as string;

  if (!recipeName || !cookbook.has(recipeName)) {
    res.status(400).send();
    return;
  }
  const entry = cookbook.get(recipeName);
  if (entry?.type !== "recipe") {
    res.status(400).send();
    return;
  }

  const recipeEntry = entry as recipe;

  try {
    const result = getRecipeSummary(recipeEntry);
    res.json(result);
  } catch (error) {
    res.status(400).send();
  }
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
