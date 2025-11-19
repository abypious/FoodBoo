package com.fooboo.repository;

import com.fooboo.model.PointsHistory;
import com.fooboo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PointsHistoryRepository extends JpaRepository<PointsHistory, Long> {
    List<PointsHistory> findByUser(User user);
}
