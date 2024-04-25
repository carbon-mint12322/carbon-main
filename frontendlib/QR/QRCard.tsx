export function QRCard({ title, body }: {
    title?: string,
    body: string
}) {

    return <>
        {title && <div className="card-header fadedText">{title}</div>}
        <div className="card-body">{body}</div>
    </>
}