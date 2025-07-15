document.addEventListener('DOMContentLoaded', () => {
  const limiter = 2;
  let location = 0;

  function move(direct) {
    if (direct) {
      location += location < limiter;
    } else {
      location -= location > 0;
    }
    console.log(location);
    document.querySelector('.slides').style.transform =
      `translateX(-${[`${location * 94.5}vw`, `${location * 1208}px`][Number(window.innerWidth > 1265)]})`;
  }

  document.querySelector('.left-arrow').addEventListener('click', function () {
    move(0);
  });
  document.querySelector('.right-arrow').addEventListener('click', function () {
    move(1);
  });
});
