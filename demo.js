var start = function(){

	var infoBtn = document.querySelector('.info-btn');
	var infoModal = document.querySelector('.info');
	var timeline = document.querySelector('.timeline__wrapper');
	var show = false;

	if(webglDetect && window.innerWidth > 600){
		new World();
	} else {

		infoModal.classList.add('no-webgl');
		timeline.style.display = 'none';
		infoBtn.style.display = 'none';

	}

	//show info window
	infoBtn.addEventListener('click', function(){

		infoModal.style.display = show ? 'none' : 'block';
		infoBtn.classList.toggle('close');

		//toggle
		show = !show;

	});
};

document.addEventListener('DOMContentLoaded', start);
