import React, { useEffect, useState } from "react";
import { fetchRooms, createRoom } from "../api/DailyVideoCallApi";
import Card from "./Card";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider , GithubAuthProvider } from "firebase/auth";
import Login from "../pages/Login";

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Lấy danh sách phòng khi user đăng nhập
    useEffect(() => {
        if (user) {
            const getRooms = async () => {
                const roomData = await fetchRooms();
                setRooms(roomData);
            };
            getRooms();
        }
    }, [user]);

    // Đăng nhập Google
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login error:", error.message);
        }
    };

    const handleGitHubLogin = async () => {
        try {
            await signInWithPopup(auth, githubProvider);
        } catch (error) {
            console.error("GitHub Login Error:", error.message);
        }
    };

    // Xử lý tạo phòng
    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            setError("Vui lòng nhập tên phòng!");
            return;
        }

        try {
            const newRoom = await createRoom(roomName);
            setRooms([...rooms, newRoom]);
            setRoomName("");
            setError("");
        } catch (error) {
            setError("Không thể tạo phòng. Vui lòng kiểm tra API key hoặc kết nối!");
        }
    };

    return (
        <>
            {user ? (
                <div>
                    <Login/>
                    <section className="flex md:flex-row md:justify-between justify-between items-center flex-col">
                        <h2 className="text-white  font-bold text-3xl text-shadow bg-blue-950  rounded-lg p-2">Room chat</h2>
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Nhập tên phòng"
                                className="p-2 bg-gray-200 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                            <button
                                onClick={handleCreateRoom}
                                className="font-bold text-sm rounded-sm text-white bg-blue-950 p-3 cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
                            >
                                Create Room
                            </button>
                        </div>
                    </section>

                    {error && <p className="text-blue-400 mb-4">{error}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 bg-cyan-950 rounded-lg p-3">
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <Link to={`rooms/${room.name}`} key={room.id}>
                                    <Card key={room.id}>{room.name} - {room.url}</Card>
                                </Link>
                            ))
                        ) : (
                            <p>We don't have any room</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-2 flex flex-col items-center justify-center justify-items-center w-max bg-cyan-300 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-white">Please Login to Continue</h2>
                    <button
                        onClick={handleGoogleLogin}
                        className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        Login with Google...
                    </button>

                    <button
                        onClick={handleGitHubLogin}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mt-3"
                    >
                        Login with GitHub...
                    </button>
                </div>
            )}
        </>
    );
};

export default RoomList;
