"use client"

import { useState } from "react"
import { Eye, Mail, Trash2, Calendar, User, MessageSquare, X, Send, Info } from "lucide-react"
import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface Contact {
  id: number
  name: string
  email: string
  subject: string
  message: string
  updatedAt: string
  Status: string
}

// Fetch contacts
const fetchContacts = async (): Promise<Contact[]> => {
  const { data } = await axios.get<Contact[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send`)
  return data
}

// Delete contact
const deleteContact = async (id: number): Promise<void> => {
  await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send/${id}`)
}

export function ContactList() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isMailFormOpen, setIsMailFormOpen] = useState(false)
  const [message, setMessage] = useState("")

  const queryClient = useQueryClient()

  // Fetch contacts
  const { data: contacts, isLoading, error } = useQuery<Contact[], Error>({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  })

  // Mutation for deletion
  const mutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-32 sm:h-64">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
  
  if (error) return (
    <div className="text-red-500 p-3 sm:p-4 bg-red-50 rounded-lg flex items-center text-sm sm:text-base">
      <Info className="mr-2 flex-shrink-0" size={16} /> 
      Error: {error.message}
    </div>
  )

  const handleDelete = (id: number) => {
    mutation.mutate(id, {
      onError: (error) => {
        console.error("Failed to delete contact:", error)
      },
    })
  }

  const handleMailClick = (contact: Contact) => {
    setIsMailFormOpen(true)
    setSelectedContact(contact)
  }

  const handleSendMessage = async () => {
    if (selectedContact) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send/${selectedContact.id}`, {
          message: message,
          Status: "Responded",
        })
        queryClient.invalidateQueries({ queryKey: ["contacts"] })
        setIsMailFormOpen(false)
        setMessage("")
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "New":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Responded":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return dateString.split("T")[0];
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {/* Desktop Table - Hidden on small screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts?.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User size={16} className="text-gray-400 mr-2" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{contact.name}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <span className="text-xs sm:text-sm text-gray-500">{contact.email}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4">
                  <div className="flex items-center">
                    <MessageSquare size={16} className="text-gray-400 mr-2" />
                    <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] lg:max-w-xs">{contact.message}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span className="text-xs sm:text-sm text-gray-500">{formatDate(contact.updatedAt)}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <span className={`px-2 sm:px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.Status)}`}>
                    {contact.Status}
                  </span>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2 sm:space-x-3">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1"
                      title="View Details"
                    >
                      <Eye size={16} className="sm:size-18" />
                    </button>
                    <button
                      onClick={() => handleMailClick(contact)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1"
                      title="Send Message"
                    >
                      <Mail size={16} className="sm:size-18" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} className="sm:size-18" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {contacts?.map((contact) => (
          <div key={contact.id} className="border-b border-gray-100 p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start">
                <User size={16} className="text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs leading-4 font-medium rounded-full ${getStatusColor(contact.Status)}`}>
                {contact.Status}
              </span>
            </div>

            <div className="flex items-center mb-3">
              <Calendar size={14} className="text-gray-400 mr-2" />
              <span className="text-xs text-gray-500">{formatDate(contact.updatedAt)}</span>
            </div>

            <div className="bg-gray-50 p-2 rounded-md mb-3">
              <p className="text-xs text-gray-600 line-clamp-2">{contact.message}</p>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setSelectedContact(contact)}
                className="p-2 text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                title="View Details"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleMailClick(contact)}
                className="p-2 text-blue-600 hover:text-blue-900 transition-colors duration-200"
                title="Send Message"
              >
                <Mail size={18} />
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                className="p-2 text-red-600 hover:text-red-900 transition-colors duration-200"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {contacts?.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-500">
            No contacts available.
          </div>
        )}
      </div>

      {/* Mail Form Modal */}
      {isMailFormOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsMailFormOpen(false)}>
          <div 
            className="relative mx-auto p-4 sm:p-6 border w-full max-w-sm sm:max-w-md md:max-w-lg shadow-xl rounded-xl bg-white" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 pr-6">
                Message to {selectedContact.name}
              </h3>
              <button 
                onClick={() => setIsMailFormOpen(false)} 
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <textarea
              className="w-full border border-gray-200 p-3 rounded-lg mb-4 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Type your message..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <div className="flex justify-end space-x-3">
              <button
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs sm:text-sm"
                onClick={() => setIsMailFormOpen(false)}
              >
                <X size={16} className="mr-1.5" />
                Cancel
              </button>
              <button
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs sm:text-sm"
                onClick={handleSendMessage}
              >
                <Send size={16} className="mr-1.5" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && !isMailFormOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="relative mx-auto p-4 sm:p-6 border w-full max-w-sm sm:max-w-md shadow-xl rounded-xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Contact Details</h3>
              <button 
                onClick={() => setSelectedContact(null)} 
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <User size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Name: {selectedContact.name}</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 break-all">{selectedContact.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{formatDate(selectedContact.updatedAt)}</span>
              </div>
              <div className="flex items-center">
                <Info size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{selectedContact.Status}</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center">
                  <MessageSquare size={16} className="text-gray-400 mr-2" /> Message:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-700">{selectedContact.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}