const form = document.querySelector('form');
if (form) {
    const uploadOnixButton = document.createElement('input');
    uploadOnixButton.type = 'file';
    uploadOnixButton.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const xmlContent = e.target.result;
                parseONIX(xmlContent);
            };
            reader.readAsText(file);
        }
    });
    form.insertAdjacentElement('afterbegin', uploadOnixButton);
}

function csv(elements) {
    const elemArray = Array.from(elements);
    return elemArray.map(e => e.textContent).join(', ');
}

function parseONIX(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
    window.xmldoc = xmlDoc;
  
    document.querySelector('input[name=title]').value = csv(xmlDoc.getElementsByTagName("b203"));
    document.querySelector('input[name=authors]').value = csv(xmlDoc.getElementsByTagName("b036"));

    const langNode = xmlDoc.getElementsByTagName("b252")[0];
    if (langNode) {
        let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
        document.querySelector('input[name=language]').value = languageNames.of(langNode.textContent);
    }

    document.querySelector('input[name=edition]').value = csv(xmlDoc.getElementsByTagName("b057"));
    document.querySelector('input[name=pages]').value = csv(xmlDoc.getElementsByTagName("b061"));
    document.querySelector('input[name=publisher]').value = csv(xmlDoc.getElementsByTagName("b081"));

    const yearNode = xmlDoc.getElementsByTagName("b003")[0];
    if (yearNode) {
        document.querySelector('input[name=year]').value = yearNode.textContent.substring(0, 4);
    }

    const isbnInput = document.querySelector('input[name=isbn]');
    let isbns = new Set(isbnInput.value.split(', '));
    isbns = isbns.union(new Set(xmlDoc.getElementsByTagName("b244")[0].textContent.split(',')));
    isbnInput.value = Array.from(isbns).join(', ');
}