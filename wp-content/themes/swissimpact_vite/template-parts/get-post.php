<div class="border-t-2 py-4 mb-4 flex flex-col">
    <div>
        <?php echo get_template_part('template-parts/get', 'post-header'); ?>

        <?php
        if (has_post_thumbnail()) :
        ?>
            <a class="block" href="<?php echo get_the_permalink(); ?>">
                <div class="h-60 relative bg-cover bg-center overflow-hidden" style="background-image: url('<?php echo get_the_post_thumbnail_url(get_the_ID(), $size = 'post-item'); ?>');">
                    <!--img src="<?php echo get_the_post_thumbnail_url(); ?>" class="img left-0 top-0 invisible" /-->
                </div>
            </a>
        <?php endif; ?>
        <div class="w-10/12 mt-4">
            <a href="<?php echo get_the_permalink(); ?>">
                <h3><?php echo get_the_title(); ?></h3>
            </a>
        </div>
    </div>

    <div class="mt-auto">
        <div class="w-10/12 mb-3">
            <p class="text-sm"><?php echo get_the_excerpt(); ?></p>
        </div>

        <div class="flex flex-column md:flex-row">
            <div class="w-full md:w-1/3 flex items-center">
                <a href="<?php echo get_the_permalink(); ?>" class="text-xs mt-2 font-black">LEARN MORE <span class="">&gt;</span></a>
            </div>
        </div>
    </div>
</div>