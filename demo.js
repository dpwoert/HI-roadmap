var start = function(){

	new World();


	var infoBtn = document.querySelector('.info-btn');
	var infoModal = document.querySelector('.info');
	var show = false;

	//show info window
	infoBtn.addEventListener('click', function(){

		infoModal.style.display = show ? 'none' : 'block';
		infoBtn.classList.toggle('close');

		//toggle
		show = !show;

	});
};

document.addEventListener('DOMContentLoaded', start);
