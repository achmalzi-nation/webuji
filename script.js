document.addEventListener('DOMContentLoaded', function () {


    /* =========================================
       ELEMENT
    ========================================= */

    var page = document.getElementById('page');

    var openBtn = document.getElementById('openBtn');

    var music = document.getElementById('music');

    var musicBtn = document.getElementById('musicBtn');

    var musicIcon = document.getElementById('musicIcon');

    var personOne = document.getElementById('personOne');

    var photos = document.querySelectorAll('.photo-slide');

    var animatedSections = document.querySelectorAll(
        '.person-slide, .message-section, .final-section'
    );


    /* =========================================
       STATE
    ========================================= */

    var musicPlaying = false;

    var currentPhoto = 0;

    var slideshow = null;

    var scrollTicking = false;


    /* =========================================
       MUSIC
    ========================================= */

    function updateMusic() {

        if (!musicBtn || !musicIcon) return;


        if (musicPlaying) {

            musicBtn.classList.add('playing');

            musicIcon.textContent = '♪';

            musicBtn.setAttribute(
                'aria-label',
                'Matikan musik'
            );

            musicBtn.setAttribute(
                'aria-pressed',
                'true'
            );

        } else {

            musicBtn.classList.remove('playing');

            musicIcon.textContent = '🔇';

            musicBtn.setAttribute(
                'aria-label',
                'Nyalakan musik'
            );

            musicBtn.setAttribute(
                'aria-pressed',
                'false'
            );

        }

    }


    function playMusic() {

        if (!music) return;


        var playPromise = music.play();


        if (playPromise !== undefined) {

            playPromise
                .then(function () {

                    musicPlaying = true;

                    updateMusic();

                })
                .catch(function () {

                    musicPlaying = false;

                    updateMusic();

                });

        }

    }


    function pauseMusic() {

        if (!music) return;

        music.pause();

        musicPlaying = false;

        updateMusic();

    }


    if (musicBtn) {

        musicBtn.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (musicPlaying) {

                    pauseMusic();

                } else {

                    playMusic();

                }

            }
        );

    }


    /* =========================================
       PHOTO SLIDESHOW
    ========================================= */

    function showPhoto(index) {

        if (photos.length === 0) return;


        photos.forEach(function (photo) {

            photo.classList.remove('active');

        });


        /*
           Double requestAnimationFrame
           agar transition tetap terbaca
           dengan baik di Chrome Android.
        */

        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                if (photos[index]) {

                    photos[index].classList.add('active');

                }

            });

        });

    }


    function startSlideshow() {

        if (photos.length === 0) return;

        if (slideshow !== null) return;


        currentPhoto = 0;

        showPhoto(currentPhoto);


        slideshow = setInterval(function () {

            currentPhoto++;


            if (currentPhoto >= photos.length) {

                currentPhoto = 0;

            }


            showPhoto(currentPhoto);

        }, 3000); /* 3 DETIK */

    }


    function stopSlideshow() {

        if (slideshow !== null) {

            clearInterval(slideshow);

            slideshow = null;

        }

    }


    function resetSlideshow() {

        stopSlideshow();

        currentPhoto = 0;


        photos.forEach(function (photo) {

            photo.classList.remove('active');

        });

    }


    /* =========================================
       SECTION ACTIVATION
    ========================================= */

    function activateSection(section) {

        if (!section) return;


        section.classList.add('active');


        if (
            section.id === 'personOne' &&
            slideshow === null
        ) {

            startSlideshow();

        }

    }


    function deactivateSection(section) {

        if (!section) return;


        section.classList.remove('active');


        if (section.id === 'personOne') {

            resetSlideshow();

        }

    }


    /* =========================================
       MOBILE SAFE DETECTION
    ========================================= */

    function checkVisibleSections() {

        if (!page) return;


        var pageRect =
            page.getBoundingClientRect();


        var viewportTop =
            pageRect.top;


        var viewportHeight =
            page.clientHeight;


        animatedSections.forEach(function (section) {

            var rect =
                section.getBoundingClientRect();


            var sectionCenter =
                rect.top +
                (rect.height / 2);


            var isActive =

                sectionCenter >
                viewportTop +
                (viewportHeight * 0.15)

                &&

                sectionCenter <
                viewportTop +
                (viewportHeight * 0.85);


            if (isActive) {

                activateSection(section);

            } else {

                deactivateSection(section);

            }

        });

    }


    /* =========================================
       SCROLL DETECTION
    ========================================= */

    if (page) {

        page.addEventListener(
            'scroll',
            function () {

                if (scrollTicking) return;


                scrollTicking = true;


                requestAnimationFrame(function () {

                    checkVisibleSections();

                    scrollTicking = false;

                });

            },
            {
                passive: true
            }
        );

    }


    /* =========================================
       INTERSECTION OBSERVER BACKUP
    ========================================= */

    if (
        page &&
        typeof IntersectionObserver !== 'undefined'
    ) {

        var animationObserver =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            activateSection(
                                entry.target
                            );

                        }

                    });

                },

                {
                    root: page,

                    threshold: 0.15

                }

            );


        animatedSections.forEach(function (section) {

            animationObserver.observe(section);

        });

    }


    /* =========================================
       OPEN BUTTON
    ========================================= */

    if (openBtn) {

        openBtn.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (!musicPlaying) {

                    playMusic();

                }


                if (personOne) {

                    /*
                       Trigger animasi langsung
                       sebelum scroll dimulai.
                    */

                    activateSection(personOne);


                    personOne.scrollIntoView({

                        behavior: 'smooth',

                        block: 'start'

                    });


                    setTimeout(function () {

                        activateSection(personOne);

                        checkVisibleSections();

                    }, 150);

                }

            }
        );

    }


    /* =========================================
       INITIAL CHECK
    ========================================= */

    setTimeout(function () {

        checkVisibleSections();

    }, 100);


    setTimeout(function () {

        checkVisibleSections();

    }, 500);


    setTimeout(function () {

        checkVisibleSections();

    }, 1000);


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        'resize',
        function () {

            checkVisibleSections();

        },
        {
            passive: true
        }
    );


    /* =========================================
       ORIENTATION CHANGE
    ========================================= */

    window.addEventListener(
        'orientationchange',
        function () {

            setTimeout(function () {

                checkVisibleSections();

            }, 300);

        }
    );


    /* =========================================
       PAGE VISIBILITY
    ========================================= */

    document.addEventListener(
        'visibilitychange',
        function () {

            if (document.hidden) {

                stopSlideshow();

            } else {

                setTimeout(function () {

                    checkVisibleSections();

                }, 150);

            }

        }
    );


    /* =========================================
       MUSIC EVENTS
    ========================================= */

    if (music) {

        music.addEventListener(
            'play',
            function () {

                musicPlaying = true;

                updateMusic();

            }
        );


        music.addEventListener(
            'pause',
            function () {

                musicPlaying = false;

                updateMusic();

            }
        );

    }


    /* =========================================
       START
    ========================================= */

    updateMusic();

});