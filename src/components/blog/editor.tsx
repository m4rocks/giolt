import "react-quill-new/dist/quill.bubble.css";
import { useState } from "react";
import ReactQuill from "react-quill-new";

interface EditorProps {
	content: string;
}

export default function Editor(props: EditorProps) {
	const [value, setValue] = useState(props.content);

	return (
		<>
			<input name="content" type="hidden" value={value} />
			<ReactQuill
				theme="bubble"
				placeholder="Write your blog post here..."
				className="h-full"
				preserveWhitespace
				value={value}
				onChange={setValue}
			/>
		</>
	);
}
