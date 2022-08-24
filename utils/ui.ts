export function showLoading() {
  if (document && document.body) {
    const coverEle = document.body.querySelector(".pd-loading-cover");
    if (!coverEle) {
      const newCoverEle = document.createElement("div");
      const newCoverSpinEle = document.createElement("div");
      const newCoverSpinInnerEle = document.createElement("div");
      newCoverEle.className = "pd-loading-cover";
      newCoverSpinEle.className = "pd-loading-spin";
      newCoverSpinInnerEle.className = "pd-loading-spin-inner";
      newCoverSpinEle.appendChild(newCoverSpinInnerEle);
      newCoverEle.appendChild(newCoverSpinEle);
      document.body.appendChild(newCoverEle);
    }
  }
}

export function hideLoading() {
  if (document && document.body) {
    const coverEle = document.body.querySelector(".pd-loading-cover");
    if (coverEle) {
      document.body.removeChild(coverEle);
    }
  }
}
