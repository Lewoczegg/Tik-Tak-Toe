const modeButtons = document.querySelectorAll('.modes > button');

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.parentNode.parentNode.classList.add('in-game');
    button.classList.add('active');
  });
});
