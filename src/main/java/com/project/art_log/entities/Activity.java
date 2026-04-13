package com.project.art_log.entities;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "activity")
public class Activity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer activityId;
	
	/*
	 user_id INTEGER REFERENCES artlog.user(user_id),
    entity_id INTEGER,
    action_type VARCHAR(25),
    entity_table VARCHAR(50),
    payload JSON,
	 */
	
	private Integer userId;
	private Integer entityId;
	private String actionType;
	private String entityTable;
	private String payload;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(insertable = false)
	private LocalDateTime updatedAt;
    
    public Activity() {
    	
    }

	public Activity(Integer userId, Integer entityId, String actionType, String entityTable, String payload) {
		super();
		this.userId = userId;
		this.entityId = entityId;
		this.actionType = actionType;
		this.entityTable = entityTable;
		this.payload = payload;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getEntityId() {
		return entityId;
	}

	public void setEntityId(Integer entityId) {
		this.entityId = entityId;
	}

	public String getActionType() {
		return actionType;
	}

	public void setActionType(String actionType) {
		this.actionType = actionType;
	}

	public String getEntityTable() {
		return entityTable;
	}

	public void setEntityTable(String entityTable) {
		this.entityTable = entityTable;
	}

	public String getPayload() {
		return payload;
	}

	public void setPayload(String payload) {
		this.payload = payload;
	}
}
