# awesome-angular-swipe

This library uses $swipe and exposes a directive which allows mobile swipe feature on everything in the DOM.

It works only for mobile device. It will do nothing on desktop (except using the dev tool to mock a mobile behavior).

# Usage

You might want to take a look at the index.html file inside the *example* folder.
The directive *swipe* can be used as a class or as an attribute. Then inject callbacks on right and left swipe, and template customization like so:

    <div class="swipe" swipe-left="doSomething" swipe-right="doAnotherSomething" left-template="leftTemplate.html" right-template="rightTemplate.html" swipeable-color="#fff">
      Swipe me!
    </div>

Note that *swipe-left* and *swipe-right* are functions, *left-template* and *right-template* are whatever templates you want, and swipeable-color is the color of the swipeable block (default value = '#fff')

# Licence

MIT

Coded with love by Linagora folks (www.linagora.com, @AwesomePaaS)
