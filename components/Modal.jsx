import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';

/**
 * Reusable modal component styled with Tailwind CSS using Headless UI.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function called when the modal is closed.
 * @param {React.ReactNode} props.children - Content of the modal.
 * @param {string} [props.title=''] - Optional title of the modal.
 * @returns {JSX.Element | null} The modal element or null if not open.
 */
const Modal = ({ isOpen, onClose, children, title = '' }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-md">
              {title && (
                <Dialog.Title as="h3" className="bg-gray-100 py-3 px-4 text-lg font-medium leading-6 text-gray-900 border-b border-gray-200">
                  {title}
                </Dialog.Title>
              )}
              <div className="px-4 py-6">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Modal;
