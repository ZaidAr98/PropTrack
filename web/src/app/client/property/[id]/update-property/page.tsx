
import React from 'react'
import UpdatePropertyForm from './components/UpdatePropertyForm'

interface Props {
    params: Promise<{ id: string }>
}

const page = async ({ params }: Props) => {
    const { id } = await params

    return (
        <div className="bg-gray-100 min-h-screen">
            <UpdatePropertyForm id={id} />
        </div>
    )
}

export default page