'use client';

import { motion } from 'framer-motion';

export default function TableBlueprint({ tables, onSelectTable, selectedTableId, guestCount }) {
  if (!tables || tables.length === 0) {
    return <div className="p-8 text-center text-white/50">Loading floor plan...</div>;
  }

  return (
    <div className="table-blueprint">
      <div className="blueprint-legend">
        <div className="legend-item">
          <span className="legend-color free"></span> Free
        </div>
        <div className="legend-item">
          <span className="legend-color reserved"></span> Reserved
        </div>
        <div className="legend-item">
          <span className="legend-color occupied"></span> Occupied
        </div>
      </div>

      <div className="blueprint-canvas">
        {/* Visual Room Labels & Lobby */}
        <div className="blueprint-label kitchen-label">KITCHEN</div>
        
        {/* Center aisle/lobby */}
        <div className="blueprint-lobby">
          <span className="lobby-text">WALKWAY / LOBBY</span>
        </div>
        
        <div className="blueprint-label entrance-label">ENTRANCE</div>

        {tables.map((table) => {
          const isSelected = table._id === selectedTableId;
          const isAvailable = table.status === 'free';
          const canFitGuests = table.capacity >= parseInt(guestCount || 1);
          const isSelectable = isAvailable && canFitGuests;

          return (
            <motion.button
              key={table._id}
              className={`blueprint-table shape-${table.shape} status-${table.status} ${
                isSelected ? 'selected' : ''
              } ${!canFitGuests ? 'capacity-mismatch' : ''}`}
              style={{
                left: `${table.position.x}%`,
                top: `${table.position.y}%`,
              }}
              onClick={() => isSelectable && onSelectTable(table)}
              disabled={!isSelectable}
              whileHover={isSelectable ? { scale: 1.05 } : {}}
              whileTap={isSelectable ? { scale: 0.95 } : {}}
              title={`Table ${table.tableNumber} (${table.capacity} seats) - ${table.status}`}
            >
              <span className="table-number">{table.tableNumber}</span>
              <span className="table-capacity">{table.capacity} Seats</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

