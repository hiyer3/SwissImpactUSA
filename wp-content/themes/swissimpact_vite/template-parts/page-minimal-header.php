<?php if (!is_home()) : ?>
<header class="flex minimum-header relative justify-center min-h-half-screen sm:min-h-sm-custom md:min-h-auto pt-12 bg-header-left bg-no-repeat bg-none">
    <?php
    echo get_template_part('template-parts/nav', 'menu')
    ?>
</header>

<style>
    header nav {
        @apply bg-none bg-swissred opacity-100;
        background-image: none!important;
    }
</style>
<?php endif; ?>