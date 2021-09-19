import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
	//* class for pagination view
	_parentElement = document.querySelector('.pagination');

	addHandleClick(handler) {
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');

			if (!btn) return;

			const goToPage = +btn.dataset.goto;

			handler(goToPage);
		});
	}

	_generateMarkUp() {
		const currentPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);

		//*1 When in the first page and other pages
		if (currentPage === 1 && numPages > 1) {
			return `
					<button data-goto="${
						currentPage + 1
					}" class="btn--inline pagination__btn--next">
				<span>Page ${currentPage + 1}</span>
				<svg class="search__icon">
				<use href="${icons}#icon-arrow-right"></use>
				</svg>
			</button> 		
			`;
		}

		//* When in the last page

		if (currentPage === numPages && numPages > 1) {
			return `
				<button data-goto="${
					currentPage - 1
				}" class="btn--inline pagination__btn--prev">
				<svg class="search__icon">
				<use href="${icons}#icon-arrow-left"></use>
				</svg>
				<span>Page ${currentPage - 1}</span>
			</button>		
			`;
		}

		//* When other pages

		if (currentPage < numPages) {
			return `
			<button data-goto="${
				currentPage - 1
			}" class="btn--inline pagination__btn--prev">
				<svg class="search__icon">
				<use href="${icons}#icon-arrow-left"></use>
				</svg>
				<span>Page ${currentPage - 1}</span>
			</button>
			
				<button data-goto="${
					currentPage + 1
				}" class="btn--inline pagination__btn--next">
				<span>Page ${currentPage + 1}</span>
				<svg class="search__icon">
				<use href="${icons}#icon-arrow-right"></use>
				</svg>
			</button>
			`;
		}

		//* When in the first and no other pages
		return `<button data-goto="${
			currentPage + 1
		}" class="btn--inline pagination__btn--next">
				<span>Page ${currentPage + 1}</span>
				<svg class="search__icon">
				<use href="${icons}#icon-arrow-right"></use>
				</svg>
			</button>`;
	}
}
export default new PaginationView();
