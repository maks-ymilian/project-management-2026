export function shake_element(element)
{
    element.classList.add("shake");
    element.addEventListener("animationend", () => element.classList.remove("shake"), {once: true});
}

