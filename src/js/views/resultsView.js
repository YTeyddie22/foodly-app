import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
	_parentElement = document.querySelector('.results');
	_errorMessage = 'No recipes found in the query';
	_successMessage = '';

	_generateMarkUp() {
		return this._data
			.map((result) => previewView.render(result, false))
			.join('');
	}
}

export default new ResultView();
