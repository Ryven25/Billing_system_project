export const generateHTML = (data) => {
  return `
      <li class="list__item">
        <p><span class="list__item-label">${data.id}</span>         
         <span class="price">$ <b>${data.amount.toFixed(2)}</b></span></p>
      </li>
    `;
};

export const getTotal = (total) => {
  return `
      <li class="list__item list__total">
        <p><span class="list__item-label">Total</span>
          <span class="price">$ <b>${total}</b></span>
        </p>
      </li>
    `;
};

export const generateCheckbox = (elem) => {
  return `
    <p class="right__payments-field">
    <label><input name=${elem.name} type="checkbox" checked/>
    <span>${elem.title}</span></label></p>
`;
};

export const generateTransaction = (idName) => {
  return `<li class="list__item">${idName}: Successful payment</li>`;
};


export const generateTitle = (data)=>{
 return `<h2 class="center__title">${data.id}</h2>
  <p class="center__desc">Payment of cold water supply</p>`;
};