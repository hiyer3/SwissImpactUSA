<?php if (!is_home()) : ?>
    <header class="flex relative justify-center min-h-half-screen sm:min-h-sm-custom md:min-h-auto pt-32 md:pt-40 lg:pt-32 bg-none">
        <?php
        echo get_template_part('template-parts/nav', 'menu')
        ?>

        <?php
        echo get_template_part('template-parts/nav', 'share')
        ?>
    </header>
<?php endif; ?>