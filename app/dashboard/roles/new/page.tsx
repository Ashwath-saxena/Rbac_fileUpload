"use client";

import { useState } from "react";
import { ROLES } from "@/lib/roles";
import { toast } from "sonner";

export default function NewRolePage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add your API call here to assign the role
      toast.success("Role assigned successfully!");
    } catch (error) {
      toast.error("Failed to assign role");
      console.error("Role assignment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Assign Role</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {ROLES.map((role) => (
              <div
                key={role.slug}
                className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedRole === role.slug
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedRole(role.slug)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <input
                        type="radio"
                        name="role"
                        value={role.slug}
                        checked={selectedRole === role.slug}
                        onChange={() => setSelectedRole(role.slug)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                </div>

                {/* Permissions List */}
                {selectedRole === role.slug && (
                  <div className="mt-4 ml-7">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Permissions:
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {role.permissions.map((permission) => (
                        <li
                          key={permission}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <svg
                            className="h-4 w-4 text-green-500 mr-2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRole || isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${
                !selectedRole || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? "Assigning..." : "Assign Role"}
            </button>
          </div>
        </form>
      </div>

      {/* Current Time Display */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Current Date and Time (UTC): {new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')}</p>
        <p>Current User: Ashwath-saxena</p>
      </div>
    </div>
  );
}