import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale';

import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react"
import { Avatar } from "./Avatar"
import { Comment } from "./Comment"
import styles from "./Post.module.css"


interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: "paragraph" | "link";
    content: string;

}
export interface PostType {
    id: number;
    author: Author;
    publishedAt: Date;
    content: Content[];
}


interface PostProps {
    post: PostType;
}

export function Post({ post }:PostProps) {

    //Comment List
    const [comments, setComments] = useState([
        "Parabéns"     
    ])

    const [newCommentText, setNewCommentText] = useState("")

    const publishedDateFormatted = format(post.publishedAt, "d 'de' LLLL 'as' HH:mm'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBR,
        addSuffix: true,
    })

    //Adding new Comment
    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault();

        setComments([...comments, newCommentText]);

        setNewCommentText("");
    }


    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity("")
        setNewCommentText(event.target.value);
    }

    function handleCreateNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity("Esse campo é obrigatório")
    }

    //Deleting Comments
    function deleteComment(commentToDelete: string) {
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment != commentToDelete
        })

        setComments(commentsWithoutDeletedOne);
    }


    const isNewCommentEmpty = newCommentText.length == 0
    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar
                        src={post.author.avatarUrl}
                    />
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormatted} dateTime={post.publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>

            </header>

            <div className={styles.content}>
                {post.content.map (line =>{
                    if(line.type == "paragraph") {
                        return <p key={line.content}>{line.content}</p>
                    
                    } else {
                        return (
                            <p key={line.content}>
                                <a href="#" target="_blank">{line.content}</a>
                            </p>
                        )
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu Feedback</strong>
                <textarea 
                    name="comment"
                    placeholder="Deixe um Comentário"
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    onInvalid={handleCreateNewCommentInvalid}
                    required
                />
                <footer>
                    <button
                    disabled ={isNewCommentEmpty}
                    type="submit">
                        Publicar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment
                            onDeleteComment={deleteComment}
                            key={comment}
                            content={comment}
                        />
                    )
                })}
            </div>
        </article>
    )
}

