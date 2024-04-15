import { ReactNode } from "react"
import ConsentButtons from "../ConsentButtons"

type InstructionsProps = {
    hideButtons?: boolean,
    text: string | ReactNode
}

export default function Instructions({ hideButtons, text }: InstructionsProps) {
    return (
        <div style={{ padding: '36px 0', maxWidth: 700 }}>
            <p>
                {text}
            </p>
            {!hideButtons && <ConsentButtons />}
        </div>
    )
}