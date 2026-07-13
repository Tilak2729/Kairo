import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {

        if (loading) return;

        if (!user) {
            navigate("/login");
        }

    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-lg">
                Loading...
            </div>
        );
    }

    return user ? children : null;
};

export default UserAuth;