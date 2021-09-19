import * as model from './model.js';
import { MODAL_SEC } from './config.js';

//////////////////////////////////////////////////////////////////////////////

//?Views

import recipeView from './views/recipeViews.js';
import searchView from './views/searchViews.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipesView from './views/addRecipesView';

////////////////////////////////////////////////////////////////////////////////

//?Libraries

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

////////////////////////////////////////////////////////////////////////////

/* if (module.hot) {
	module.hot.accept();
} */

//!1. To load the recipe

const controlRecipes = async function () {
	try {
		let id = window.location.hash.slice(1);

		if (!id) return;

		recipeView.renderSpinner();

		//*1 Update result view to mark the selected search view

		resultsView.update(model.getResultPage());
		bookMarksView.update(model.state.bookmark);

		//*2 load and await the Recipe

		await model.loadRecipe(id);

		//* 3. Rendering the Recipe

		recipeView.render(model.state.recipes);

		///////////////////////////////////////////////////////////////////
	} catch (err) {
		recipeView.renderErrorMessage();
		console.error(`${err}`);
	}
};

///////////////////////////////////////////////////////////////////////////

//!2. Waiting for the search result asynchronously

const controlSearchResult = async function () {
	try {
		//* render Spinner

		resultsView.renderSpinner();

		//* 1 Query Result

		const query = searchView.getQuery();
		if (!query) return;

		//*2 Load and awaiting result

		await model.loadSearchResult(query);

		//*3 Render the searched results

		resultsView.render(model.getResultPage());

		//*4 Render the buttons

		paginationView.render(model.state.search);

		//////////////////////////////////////////////////////////////////////////////////
	} catch (error) {
		console.log(error);
	}
};

/////////////////////////////////////////////////////////////////////////////

//!3. Controlling the pagination

const controlPagination = function (goToPage) {
	//*1 Render the searched results

	resultsView.render(model.getResultPage(goToPage));

	//*2 Render the buttons

	paginationView.render(model.state.search);
};

///////////////////////////////////////////////////////////////////////////////////

//!4 Controlling the servings

const controlServings = function (newServings) {
	//*1 Update recipe servings

	model.updateServings(newServings);

	//*2 Update Recipe Views

	/* recipeView.render(model.state.recipes); */
	recipeView.update(model.state.recipes);
};

////////////////////////////////////////////////////////////

//!5. Controlling the bookMark

const controlBookmark = function () {
	//*1 Check if the bookMark is added or remove

	if (!model.state.recipes.bookmarked) model.addBookmark(model.state.recipes);
	else model.deleteBookmark(model.state.recipes.id);

	//*2 Updating the bookMark in the recipeView
	recipeView.update(model.state.recipes);

	//*3 Render bookMark

	bookMarksView.render(model.state.bookmark);
};
///////////////////////////////////////////////////////////////////

const controlBookmarksHandler = function () {
	bookMarksView.render(model.state.bookmark);
};

const controlUploadRecipe = async function (newRecipe) {
	try {
		addRecipesView.renderSpinner();
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipes);

		recipeView.render(model.state.recipes);

		addRecipesView.renderSuccessMessage();

		bookMarksView.render(model.state.bookmark);

		window.history.pushState(null, '', `#${model.state.recipes.id}`);

		setTimeout(function () {
			addRecipesView.toggleWindow();
		}, MODAL_SEC * 1000);
	} catch (error) {
		console.error(`${error}`);
		addRecipesView.renderErrorMessage(error.message);
	}
};
//!Initialization function

const init = function () {
	bookMarksView.addHandlerRender(controlBookmarksHandler);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addBookmarkHandler(controlBookmark);
	searchView.addHandlerSearch(controlSearchResult);
	paginationView.addHandleClick(controlPagination);
	addRecipesView.addHandlerUpload(controlUploadRecipe);
};
init();
