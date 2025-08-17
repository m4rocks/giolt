export const mdClassName =
	"prose dark:prose-invert prose-neutral max-w-none " +
	"prose-headings:font-black prose-h1:text-5xl prose-headings:mb-4 " +
	"prose-li:my-0";

export const calculateReadingTimeFromHTML = (str: string) => {
	const text = str.replace(/(<([^>]+)>)/gi, "");
	const words = text.split(/\s+/).length;
	const minutes = Math.ceil(words / 200);
	return minutes;
};
