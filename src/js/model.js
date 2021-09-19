import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

//!1 Creating a state and exporting it to the controller

export const state = {
	recipes: {},
	search: {
		query: '',
		results: [],
		resultsPerPage: RES_PER_PAGE,
		page: 1,
	},
	bookmark: [],
};

const createRecipe = function (data) {
	//*1. destructuring the recipe from data and connecting it to the state of the of model
	const { recipe } = data.data;
	return (state.recipes = {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }),
	});
};
//!2 Creating an asynchronous loaded Recipe and exporting it to the controller

export const loadRecipe = async function (id) {
	//*1 Calling the recipe

	try {
		const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
		state.recipes = createRecipe(data);
		////////////////////////////////////////////////////////////////////////////////////////////

		//*1 To check if the bookmarked recipe is true or false
		if (state.bookmark.some((bookmark) => bookmark.id === id))
			state.recipes.bookmarked = true;
		else state.recipes.bookmarked = false;

		///////////////////////////////////////////////////////////////////////////////////////////////
	} catch (err) {
		console.error(`${err}`);
		throw err;
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////////

//!2 Creating an asynchronous Search function and exporting it to the controller

export const loadSearchResult = async function (query) {
	try {
		//*1 Get the searched query

		state.search.query = query;

		const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

		//*2 Get the results from the recipes

		state.search.results = data.data.recipes.map((recipe) => {
			return {
				id: recipe.id,
				title: recipe.title,
				publisher: recipe.publisher,
				image: recipe.image_url,
				...(recipe.key && { key: recipe.key }),
			};
		});

		//* Go back to the first Page during querying another recipe

		state.search.page = 1;

		///////////////////////////////////////////////////////////////////////////////////////
	} catch (error) {
		console.error(`${error}`);
		throw error;
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////

//!3 Creating a pagination function and exporting it to the controller

export const getResultPage = function (page = state.search.page) {
	state.search.page = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;

	return state.search.results.slice(start, end);
};

//!4 Creating and Exporting the update servings to the controller

export const updateServings = function (newServings) {
	state.recipes.ingredients.forEach((ingredients) => {
		ingredients.quantity =
			(ingredients.quantity * newServings) / state.recipes.servings;
	});

	//*Update servings in state

	state.recipes.servings = newServings;
};

//! Creating a local Storage

const persistBookmarks = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

//!5 Exporting bookmark recipe information

export const addBookmark = function (recipe) {
	//* MArk current recipe as bookmarked

	if (recipe.id === state.recipes.id) state.recipes.bookmarked = true;

	//* Add bookMark
	state.bookmark.push(recipe);

	persistBookmarks();
};

//!Exporting delete bookmarked recipe information

export const deleteBookmark = function (id) {
	const index = state.bookmark.findIndex((el) => el.id === id);

	if (id === state.recipes.id) state.recipes.bookmarked = false;

	state.bookmark.splice(index, 1);
	persistBookmarks();
};

const init = function () {
	const storage = localStorage.getItem('bookmarks');

	if (storage) state.bookmark = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
			.map((ing) => {
				const ingArr = ing[1].split(',').map((el) => el.trim());

				if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');

				const [quantity, unit, description] = ingArr;
				return { quantity: quantity ? +quantity : null, unit, description };
			});
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};
		console.log(recipe);
		const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
		state.recipes = createRecipe(data);
		addBookmark(state.recipes);
	} catch (error) {
		throw error;
	}
};
