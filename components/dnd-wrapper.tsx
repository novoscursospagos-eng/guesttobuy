'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  DollarSign,
  Clock,
  User,
  HomeIcon,
  Activity,
  Building,
} from 'lucide-react';

interface DndWrapperProps {
  funnel: any;
  leads: any[];
  contacts: any[];
  properties: any[];
  organizations: any[];
  activities: any[];
  onDragEnd: (result: any) => void;
  onLeadClick: (lead: any) => void;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
}

export function DndWrapper({
  funnel,
  leads,
  contacts,
  properties,
  organizations,
  activities,
  onDragEnd,
  onLeadClick,
  formatCurrency,
  formatDate,
}: DndWrapperProps) {
  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stageId === stageId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {funnel.stages?.map((stage: any) => {
          const stageLeads = getLeadsByStage(stage.id);
          const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

          return (
            <div key={stage.id} className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="font-semibold text-foreground">{stage.name}</h3>
                  <Badge variant="secondary">{stageLeads.length}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(stageValue)}
                </div>
              </div>

              {/* Droppable Stage */}
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-muted/50' : ''
                    }`}
                  >
                    {stageLeads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                              snapshot.isDragging ? 'rotate-3 shadow-lg' : 'hover:scale-105'
                            }`}
                            onClick={(e) => {
                              // Only open panel if not dragging
                              if (!snapshot.isDragging) {
                                onLeadClick(lead);
                              }
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Lead Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-foreground text-sm line-clamp-2">
                                      {lead.title}
                                    </h4>
                                    <Badge variant="outline" className="mt-1 text-xs">
                                      {lead.type}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle more options
                                    }}
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>

                                {/* Lead Details */}
                                <div className="space-y-2">
                                  {lead.estimatedValue > 0 && (
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {formatCurrency(lead.estimatedValue)}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDate(lead.createdAt)}
                                  </div>

                                  {lead.contactId && (
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <User className="h-3 w-3 mr-1" />
                                      {contacts.find(c => c.id === lead.contactId)?.name}
                                    </div>
                                  )}
                                </div>

                                {/* Attachment Indicators */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {(lead.attachedProperties?.length || 0) > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      <HomeIcon className="h-3 w-3 mr-1" />
                                      {lead.attachedProperties.length}
                                    </Badge>
                                  )}
                                  {(lead.attachedActivities?.length || 0) > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Activity className="h-3 w-3 mr-1" />
                                      {lead.attachedActivities.length}
                                    </Badge>
                                  )}
                                  {(lead.attachedContacts?.length || 0) > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      <User className="h-3 w-3 mr-1" />
                                      {lead.attachedContacts.length}
                                    </Badge>
                                  )}
                                  {(lead.attachedOrganizations?.length || 0) > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Building className="h-3 w-3 mr-1" />
                                      {lead.attachedOrganizations.length}
                                    </Badge>
                                  )}
                                </div>

                                {/* Priority Indicator */}
                                {lead.priority && lead.priority !== 'medium' && (
                                  <div className="flex justify-end">
                                    <Badge 
                                      variant={lead.priority === 'high' || lead.priority === 'urgent' ? 'destructive' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {lead.priority === 'high' ? 'Alta' : 
                                       lead.priority === 'urgent' ? 'Urgente' : 
                                       lead.priority === 'low' ? 'Baixa' : 'Média'}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}