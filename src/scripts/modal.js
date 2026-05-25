export function initPhotoModal() {
  const modal = document.getElementById('universalModal');
  const modalContent = document.getElementById('modalContent');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSettings = document.getElementById('modalSettings');
  if (!modal) return;

  window.openModal = function (element) {
    const imgSrc = element.querySelector('img').src;
    const title = element.dataset.name;
    const desc = element.dataset.desc;
    const settings = element.dataset.settings;

    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalSettings.textContent = settings;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }, 300);
  };
}
