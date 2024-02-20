import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/503d71f8346f6119d8a23b3cd5f79033/raw/16b35b102b3c7fe9ed34534968a3f2c512be48d1/single-price-data.xml';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const sectionJoinCommunityTemplate = document.getElementById(
	'section-join-community-template'
);
const sectionMonthlySubscriptionTemplate = document.getElementById(
	'section-monthly-subsription-template'
);
const sectionWhyUsTemplate = document.getElementById('section-why-us-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (parentEl, name) => {
		const element = parentEl.getElementsByTagName(name)[0];
		const hasChildren = !!element.children.length;
		if (hasChildren) {
			return [...element.children].map(
				(item) => item.childNodes[0].nodeValue
			);
		}
		return element.childNodes[0].nodeValue;
	};

	const sectionsData = dataDoc.getElementsByTagName('section');
	const [joinCommunityData, monthlySubscriptionData, whyUsData] =
		sectionsData;

	const joinCommunityTitle = getElementValue(joinCommunityData, 'title');
	const joinCommunitySubtitle = getElementValue(
		joinCommunityData,
		'subtitle'
	);
	const joinCommunityDescription = getElementValue(
		joinCommunityData,
		'description'
	);

	const monthlySubscriptionTitle = getElementValue(
		monthlySubscriptionData,
		'title'
	);
	const monthlySubscriptionPrice = getElementValue(
		monthlySubscriptionData,
		'price'
	);
	const monthlySubscriptionDescription = getElementValue(
		monthlySubscriptionData,
		'description'
	);

	const whyUsTitle = getElementValue(whyUsData, 'title');
	const whyUsBenefits = getElementValue(whyUsData, 'benefits');

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');
	const sectionGroupEl = cardTemplateNode.querySelector('.card__group');

	/* section join community */
	const sectionJoinCommunityTemplateNode = document.importNode(
		sectionJoinCommunityTemplate.content,
		true
	);
	const sectionJoinCommunityEl =
		sectionJoinCommunityTemplateNode.querySelector(
			'.card__block--join-community'
		);

	const sectionJoinCommunityTitleEl =
		sectionJoinCommunityEl.querySelector('.card__title');
	sectionJoinCommunityTitleEl.textContent = joinCommunityTitle;

	const sectionJoinCommunitySubtitleEl =
		sectionJoinCommunityEl.querySelector('.card__subtitle');
	sectionJoinCommunitySubtitleEl.textContent = joinCommunitySubtitle;

	const sectionJoinCommunityDescriptionEl =
		sectionJoinCommunityEl.querySelector('.card__desc');
	sectionJoinCommunityDescriptionEl.textContent = joinCommunityDescription;

	/* section monthly subscription */
	const sectionMonthlySubscriptionTemplateNode = document.importNode(
		sectionMonthlySubscriptionTemplate.content,
		true
	);
	const sectionMonthlySubscriptionEl =
		sectionMonthlySubscriptionTemplateNode.querySelector(
			'.card__block--monthly-subsription'
		);

	const sectionMonthlySubscriptionTitleEl =
		sectionMonthlySubscriptionEl.querySelector('.card__title');
	sectionMonthlySubscriptionTitleEl.textContent = monthlySubscriptionTitle;

	const sectionMonthlySubscriptionPriceEl =
		sectionMonthlySubscriptionEl.querySelector('.card__price');
	const sectionMonthlySubscriptionPriceAmountEl =
		sectionMonthlySubscriptionPriceEl.querySelector('.num');
	sectionMonthlySubscriptionPriceAmountEl.textContent =
		monthlySubscriptionPrice.substring(
			0,
			monthlySubscriptionPrice.indexOf(' ')
		);
	const sectionMonthlySubscriptionPriceLabelEl =
		sectionMonthlySubscriptionPriceEl.querySelector('.label');
	sectionMonthlySubscriptionPriceLabelEl.textContent =
		monthlySubscriptionPrice.substring(
			monthlySubscriptionPrice.indexOf(' ') + 1
		);

	const sectionMonthlySubscriptionDescriptionEl =
		sectionMonthlySubscriptionEl.querySelector('.card__desc');
	sectionMonthlySubscriptionDescriptionEl.textContent =
		monthlySubscriptionDescription;

	/* section why us */
	const sectionWhyUsTemplateNode = document.importNode(
		sectionWhyUsTemplate.content,
		true
	);
	const sectionWhyUsEl = sectionWhyUsTemplateNode.querySelector(
		'.card__block--why-us'
	);

	const sectionWhyUsTitleEl = sectionWhyUsEl.querySelector('.card__title');
	sectionWhyUsTitleEl.textContent = whyUsTitle;

	const sectionWhyUsListEl = sectionWhyUsEl.querySelector('.card__list');

	for (const benefit of whyUsBenefits) {
		const sectionWhyUsListItemEl = document.createElement('li');
		sectionWhyUsListItemEl.textContent = benefit;

		sectionWhyUsListEl.appendChild(sectionWhyUsListItemEl);
	}

	removeLoading();
	sectionGroupEl.appendChild(sectionMonthlySubscriptionTemplateNode);
	sectionGroupEl.appendChild(sectionWhyUsTemplateNode);
	cardEl.prepend(sectionJoinCommunityTemplateNode);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
