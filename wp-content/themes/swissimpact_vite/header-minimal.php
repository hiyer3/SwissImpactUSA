<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-5963GNL3');
    </script>
    <!-- End Google Tag Manager -->
    <?php wp_head(); ?>
</head>

<body <?php body_class('overflow-x-hidden'); ?>>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5963GNL3"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php wp_body_open(); ?>

    <div id="preloadar">
        <div>
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/nav/nav-logo-2x.png" alt="Swiss Impact" style="max-width: 300px; width: 95%; margin: 0 auto;" />
        </div>
    </div>
    <style>
        #preloadar .custom {
            background-image: url("<?php echo get_template_directory_uri(); ?>/assets/img/nav/nav-logo-2x.png");
            background-size: contain;
            width: 300px;
            background-repeat: no-repeat;
            background-position: center;
            height: 200px;
            position: relative;
            overflow: hidden;
        }

        #preloadar .custom::after {
            content: "";
            display: block;
            position: absolute;
            bottom: 30px;
            left: 0;
            width: 0%;
            border-bottom: 2px solid white;
            animation: loaderanim 1s ease-in-out infinite;
            overflow: hidden;
        }

        @keyframes loaderanim {
            0% {
                width: 0%;
                margin-left: 0;
            }

            50% {
                width: 100%;
                margin-left: 0;
            }

            100% {
                width: 100%;
                margin-left: 100%;
            }
        }
    </style>

    <section class="main-content" style="display:none;">

        <?php echo get_template_part('template-parts/page', 'minimal-header'); ?>

        <div id="root">

        </div>