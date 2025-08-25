<?php
$background_image = get_template_directory_uri() . '/assets/img/home/hero-bg-2x.jpg';
if (!is_front_page()) {
    $background_image = get_template_directory_uri() . '/assets/img/home/hero-bg-inverse-2x.jpg';
}
?>
<nav class="md:h-20 h-16 w-full fixed top-0 bg-header-left bg-no-repeat z-50" style="background-image: url('<?php echo $background_image; ?>');">
    <div class="flex md:block img w-1/3 absolute h-full -z-10 items-center nav-logo-wrapper">
        <a href="<?php echo get_site_url(); ?>"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/nav/nav-logo-2x.png" class="img align-center md:h-full py-3 ml-5" alt="Swiss Impact Logo" /></a>
    </div>
    <div class="h-16 menu flex mx-auto my-auto flex-col place-content-evenly py-3">
        <span></span>
        <span></span>
    </div>

    <div class="dropdown flex flex-col">
        <div class="h-4/5 pt-12 md:pt-28 pb-5 overflow-y-auto w-11/12 md:w-10/12 mx-auto">
            <?php
            echo wp_nav_menu(array(
                'menu'   => 'primary',
                'menu_class' => 'nav-menu'
            ));
            ?>
        </div>
        <div class="nav-dropdown-bottom h-1/5 flex flex-col items-center w-11/12 md:w-8/12 mx-auto">
            <a href="<?php echo get_site_url(); ?>"><img class="img" alt="Navbar Logo" src="<?php echo get_template_directory_uri(); ?>/assets/img/nav/nav-logo-2x.png" /></a>
        </div>
    </div>

    <div class="search-bar-wrapper absolute right-5 top-0 inline-flex h-full items-center">
        <div class="md:-mt-2 h-8 w-8 relative">
            <img class="h-4 absolute top-0 right-0 mt-2 mr-1 search-icon z-999" src="<?php echo get_template_directory_uri(); ?>/assets/img/backpages/Icon-search-2x.png" alt="search-icon" />
            <input disabled placeholder="search..." name="s" class="bg-swissred md:bg-transparent absolute search-bar h-8 top-0 -right-1 w-8 border-white border rounded-full" />
        </div> 
    </div>
</nav>