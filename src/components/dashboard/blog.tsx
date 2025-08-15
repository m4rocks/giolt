import type { SelectBlogPosts } from "@/db/schema";
import { PlusIcon } from "lucide-react";

interface BlogProps {
	orgId: string;
	blog: SelectBlogPosts[];
}

export default function Blog(props: BlogProps) {
	return (
		<>
			<h1 className="font-bold mb-2">Blog</h1>
			<a href="/blog/new" className="btn btn-primary mb-2">
				<PlusIcon />
				Create post
			</a>
			<ul className="list bg-base-200 rounded-box">
				{props.blog
					? props.blog.map((blog) => (
							<li className="list-row" key={blog.id}>
								<div className="list-col-grow">
									<p>{blog.title}</p>
								</div>
								<a
									className="btn btn-primary"
									href={`/blog/${blog.id}`}>
									Edit
								</a>
								<a
									className="btn btn-outline"
									href={`https://${props.orgId}.giolt.org/blog/${blog.id}`}>
									Preview
								</a>
							</li>
						))
					: null}
			</ul>
		</>
	);
}
