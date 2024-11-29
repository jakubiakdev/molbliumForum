import React from "react";
import { CaretDoubleRight } from "@phosphor-icons/react";

export default function Threads() {
    return (
        <table className="w-full">
            <thead className="text-left">
                <tr>
                    <th>Title</th>
                    <th>Replies</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-slate-800">
                    <td className="p-2">
                        <div className="w-full p-1">
                            <p className="text-lg mb-2">
                                How do I write hello world in HTML?
                            </p>
                            <div className="flex text-sm items-center">
                                <span style={{ background: "orange" }} className="p-1 px-3 rounded-sm">Developement</span>
                                <div>
                                    <img src="https://cataas.com/cat?width=128&height=128" alt="" className="rounded-full inline-block size-6 ring-1 ml-2 mr-1" />
                                    <span>Anon</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="p-2">5</td>
                    <td className="p-2">
                        <p>21/11/2024</p>
                    </td>
                    <td className="p-2">
                        <CaretDoubleRight size={32} /> 
                        {/* TODO: Whole thread clickable */}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
