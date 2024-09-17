import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import the specific icons you want to use
import { faLinkedin, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

// Add the icons to the library
library.add(faLinkedin, faFacebook, faTwitter, faInstagram, faEnvelope, faPhone, faMapMarkerAlt);

export default FontAwesomeIcon;