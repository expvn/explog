document.getElementById('action-btn').addEventListener('click', function () {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p style="margin-top: 1rem; font-weight: bold;">Hello from standalone JS!</p>';
    this.textContent = 'Clicked!';
});
