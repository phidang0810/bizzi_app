import React from "react";
import { Link } from 'react-router-dom'

interface Props {}

export const PageNotFound: React.FC<Props> = () => {
    return (
        <div>
            <div
                style={{
                    minHeight: 'calc(100vh - 500px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        maxWidth: '560px',
                        backgroundColor: '#fff',
                        padding: '80px 30px',
                        margin: '100px auto',
                        borderRadius: '10px',
                        flex: '1',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '400px',
                            margin: '0 auto',
                        }}
                    >
                        <h1 className="font-size-36 mb-2">Page not found</h1>
                        <p className="mb-3">The page is deprecated, deleted, or does not exist at all</p>
                        <h1 className="font-size-80 mb-4 font-weight-bold">404 —</h1>
                        <Link to="/" className="btn">
                            &larr; Go back to the home page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
