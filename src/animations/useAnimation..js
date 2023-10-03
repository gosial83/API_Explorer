import { gsap } from "gsap";
import {SplitText} from "gsap/SplitText";
gsap.registerPlugin(SplitText);


export function useAnimation() {
    const bump = (IdName) => {
        let id = document.getElementById(IdName);
        let mySplitText = new SplitText(id, { type: "words,chars" });
        let chars = mySplitText.chars;
        gsap.to(chars, {duration: 0.3, y: -10, stagger: 0.05});
        gsap.to(chars, {duration: 0.3, y: 0, stagger: 0.05, delay:0.15});
    }

    return { bump };
}
