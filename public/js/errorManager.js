(function () {
    var inputs = document.querySelectorAll('input');
    var errorText = document.querySelector('#errorText');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            errorText.setAttribute('style', 'display: none');
        })
    });
})();
