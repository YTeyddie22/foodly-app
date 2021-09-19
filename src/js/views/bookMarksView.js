import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookMarksView extends View {
	_parentElement = document.querySelector('.bookmarks__list');
	_errorMessage = 'No bookMarks. Find recipe and bookmark it';
	_successMessage = '';

	addHandlerRender(handler) {
		window.addEventListener('load', handler);
	}

	_generateMarkUp() {
		return this._data
			.map((bookmarks) => previewView.render(bookmarks, false))
			.join('');
	}
}

export default new BookMarksView();
