addEventListener('fetch', event => {
	// Check if the endpoint is link
	if (event.request.url.endsWith('/link')) {
    	event.respondWith(handleListRequest(event.request));
	} else{
		event.respondWith(handleOtherRequest(event.request));
	}
  
})

const url = "https://static-links-page.signalnerve.workers.dev";
const linksArray = [{ "name": "Github", "url": "https://github.com/sumansid" },{ "name": "Personal Site", "url": "https://sumansid.github.io/Personal-Website/" },{ "name": "Wolfram Site", "url": "https://community.wolfram.com/web/sumansid1113" }];
const avatarUrl = "https://avatars2.githubusercontent.com/u/53033648?v=4";
const socialArray = [{url: "https://www.linkedin.com/in/sumansigdel/", svg:"https://img.icons8.com/linkedin"},{url:"https://github.com/sumansid", svg:"https://img.icons8.com/github"}];

async function handleListRequest(request) {
  	return new Response(JSON.stringify(linksArray), {
    	headers: { 'Content-Type': 'application/json' },
  	})
}

async function handleOtherRequest(request){

	let response = await fetch(url);
	const elementTitle = new ElementHandler("Suman Sigdel");
	const elementName = new ElementHandler("Suman Sigdel");
	response = new HTMLRewriter()
	.on('div#links', new LinksTransformer(linksArray))
	.on('title', elementTitle)
    .on('div#profile', { element: (element) => {
      element.removeAttribute('style');
    }})
    .on('h1#name', elementName)
    .on('img#avatar', { element: (element) => {
      element.setAttribute('src', avatarUrl);
    }})
    .on('body', { element: element => {
      element.setAttribute("class", "bg-blue-500");
    }})
    .on('div#social', new SocialsTransformer(socialArray))
	.transform(response);
	return response
}

// HTML Rewriting
class ElementHandler {
	constructor(value){
		this.value = value
	}
	element(element) {
		element.setInnerContent(this.value)
	}
}

class SocialsTransformer {
	constructor(socials){
		this.socials = socials;
	}
	async element(element){
		element.removeAttribute('style');
		this.socials.forEach((social) => {
			element.append(`<a href="${social.url}" target="_blank"><img src=${social.svg}/></a>`, { html: true });

		});
	}
}


class LinksTransformer {
  constructor(links) {
    this.links = links;
  }
  
  async element(element) {
    this.links.forEach((link) => {
    	element.append(`<a href="${link.url}" target="_blank">${link.name}</a>`, { html: true });

    });
  }
}

