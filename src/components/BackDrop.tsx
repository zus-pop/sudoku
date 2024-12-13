import { motion } from "motion/react";

const BackDrop = ({
  handleClose,
  children,
}: {
  handleClose(): void;
  children: React.ReactNode;
}) => {

  return (
    <motion.div
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      {children}
    </motion.div>
  );
};

export default BackDrop;
