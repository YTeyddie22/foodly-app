import icons from 'url:../../img/icons.svg';

export default class View {
	_data;

	/**
	 *
	 * @param {Object} data The data is a collection of objects to be rendered to the browser platform
	 */

	//! Rendering to the view
	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderErrorMessage();

		this._data = data;
		const markup = this._generateMarkUp();

		if (!render) return markup;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	/////////////////////////////////////////////////////////////////////////////

	//! Rejecting the views from rerendering

	update(data) {
		this._data = data;
		const newMarkup = this._generateMarkUp();

		const newDOM = document.createRange().createContextualFragment(newMarkup);

		const newElements = Array.from(newDOM.querySelectorAll('*'));

		const curElements = Array.from(this._parentElement.querySelectorAll('*'));

		//? Algorithm to ensure the DOM doesn't flicker when re-rendering

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i];
			// Update Text
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ''
			) {
				curEl.textContent = newEl.textContent;
			}

			//Update attributes
			if (!newEl.isEqualNode(curEl))
				Array.from(newEl.attributes).forEach((attribute) =>
					curEl.setAttribute(attribute.name, attribute.value)
				);
		});
	}

	//! Clear the page
	_clear() {
		this._parentElement.innerHTML = '';
	}

	/////////////////////////////////////////////////////////////////////////////////

	//! Rendering Spinner to page

	renderSpinner = function () {
		const markup = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	};

	///////////////////////////////////////////////////////////////////////////////////

	//! Creating a success message

	renderSuccessMessage(message = this._successMessage) {
		const markup = `<div class="message">
					<div>
						<svg>
							<use href="${icons}"></use>
						</svg>
					</div>
					<p>${message}</p>
				</div>`;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	///////////////////////////////////////////////////////////////////

	//!Creating an error message

	renderErrorMessage(message = this._errorMessage) {
		const markup = `<div class='error'>
				<div>
					<svg>
						<use href="${icons}#icon-alert-triangle"></use>
					</svg>
				</div>
				<p>${message}</p>
			</div>`;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
}
